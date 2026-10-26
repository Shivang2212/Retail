import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrls: ['./products.scss']
})
export class Products implements OnInit {
  products: any[] = [];
  loading = false;
  saving = false;
  error = '';

  showForm = false;
  editingProduct: any = null;
  formData: any = { name: '', description: '', sku: '', price: 0, quantity: 0 };
  formError = '';

  // Delete confirmation
  deleteTarget: any = null;
  deleteConfirming = false;
  deleting = false;

  constructor(
    private productService: ProductService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() { this.loadProducts(); }

  loadProducts() {
    this.loading = true;
    this.error = '';
    this.productService.getAll().subscribe({
      next: (data) => { 
        this.products = data; 
        this.loading = false; 
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.status === 401 ? 'Session expired. Please log in again.'
                   : err.status === 403 ? 'You do not have permission to view products.'
                   : err.status === 0   ? 'Cannot reach server. Check your connection.'
                   : 'Failed to load products.';
        this.loading = false;
        this.cdr.detectChanges();
        this.toast.error(this.error);
      }
    });
  }

  openAddForm() {
    this.editingProduct = null;
    this.formData = { name: '', description: '', sku: '', price: 0, quantity: 0 };
    this.formError = '';
    this.showForm = true;
    this.cdr.detectChanges();
  }

  editProduct(product: any) {
    this.editingProduct = product;
    this.formData = { ...product };
    this.formError = '';
    this.showForm = true;
    this.cdr.detectChanges();
  }

  closeForm() {
    this.showForm = false;
    this.editingProduct = null;
    this.formError = '';
    this.cdr.detectChanges();
  }

  validateForm(): string {
    if (!this.formData.name?.trim()) return 'Product name is required.';
    if (!this.formData.sku?.trim())  return 'SKU is required.';
    if (this.formData.price < 0)     return 'Price cannot be negative.';
    if (this.formData.quantity < 0)  return 'Quantity cannot be negative.';
    return '';
  }

  saveProduct() {
    const err = this.validateForm();
    if (err) { this.formError = err; return; }

    this.saving = true;
    this.formError = '';
    this.cdr.detectChanges();

    const action = this.editingProduct
      ? this.productService.update(this.editingProduct.id, this.formData)
      : this.productService.create(this.formData);

    action.subscribe({
      next: (res: any) => {
        this.toast.success(this.editingProduct ? 'Product updated successfully!' : 'Product created successfully!');
        this.closeForm();
        this.saving = false;
        if (this.editingProduct) {
          const idx = this.products.findIndex(p => p.id === this.editingProduct.id);
          if (idx !== -1) {
            this.products[idx] = { ...this.formData, id: this.editingProduct.id };
          }
        } else if (res && res.id) {
          this.products.unshift(res);
        }
        this.cdr.detectChanges();
        this.loadProducts();
      },
      error: (err) => {
        this.formError = err.status === 409 ? 'A product with this SKU already exists.'
                       : err.status === 403 ? 'You do not have permission to do this.'
                       : err.status === 400 ? 'Invalid data. Please check your inputs.'
                       : err.error?.message || 'Failed to save product.';
        this.toast.error(this.formError);
        this.saving = false;
        this.cdr.detectChanges();
      }
    });
  }

  confirmDelete(product: any) {
    this.deleteTarget = product;
    this.deleteConfirming = true;
    this.cdr.detectChanges();
  }

  cancelDelete() {
    if (this.deleting) return;
    this.deleteTarget = null;
    this.deleteConfirming = false;
    this.cdr.detectChanges();
  }

  executeDelete() {
    if (!this.deleteTarget) return;
    const target = this.deleteTarget;
    const id = target.id;
    const name = target.name;
    const previousProducts = [...this.products];

    // Instantly close modal and remove from UI
    this.deleteConfirming = false;
    this.deleteTarget = null;
    this.products = this.products.filter(p => p.id !== id);
    this.cdr.detectChanges();

    this.productService.delete(id).subscribe({
      next: () => {
        this.toast.success(`"${name}" deleted successfully.`);
      },
      error: (err) => {
        // Revert on error
        this.products = previousProducts;
        this.cdr.detectChanges();
        const msg = err.status === 403 ? 'You do not have permission to delete this product.'
                  : err.status === 404 ? 'Product not found — it may have already been deleted.'
                  : 'Failed to delete product.';
        this.toast.error(msg);
      }
    });
  }
}
