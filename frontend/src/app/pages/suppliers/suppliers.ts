import { Component, OnInit , ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupplierService } from '../../services/supplier';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './suppliers.html',
  styleUrls: ['./suppliers.scss']
})
export class Suppliers implements OnInit {
  suppliers: any[] = [];
  loading = false;
  saving = false;
  error = '';

  showForm = false;
  editingSupplier: any = null;
  formData: any = { name: '', contactEmail: '', contactPhone: '', address: '' };
  formError = '';

  deleteTarget: any = null;
  deleteConfirming = false;

  constructor(private supplierService: SupplierService, private toast: ToastService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.loadSuppliers(); }

  loadSuppliers() {
    this.loading = true;
    this.error = '';
    this.supplierService.getAll().subscribe({
      next: (data) => {
        this.suppliers = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to load suppliers.';
        this.loading = false;
        this.cdr.detectChanges();
        this.toast.error(this.error);
      }
    });
  }

  openAddForm() {
    this.editingSupplier = null;
    this.formData = { name: '', contactEmail: '', contactPhone: '', address: '' };
    this.formError = '';
    this.showForm = true;
    this.cdr.detectChanges();
  }

  editSupplier(supplier: any) {
    this.editingSupplier = supplier;
    this.formData = { ...supplier };
    this.formError = '';
    this.showForm = true;
    this.cdr.detectChanges();
  }

  closeForm() {
    this.showForm = false;
    this.editingSupplier = null;
    this.formError = '';
    this.cdr.detectChanges();
  }

  saveSupplier() {
    this.saving = true;
    this.formError = '';
    this.cdr.detectChanges();

    const action = this.editingSupplier
      ? this.supplierService.update(this.editingSupplier.id, this.formData)
      : this.supplierService.create(this.formData);

    action.subscribe({
      next: (res: any) => {
        this.toast.success(this.editingSupplier ? 'Supplier updated!' : 'Supplier created!');
        this.closeForm();
        this.saving = false;
        if (this.editingSupplier) {
          const idx = this.suppliers.findIndex(s => s.id === this.editingSupplier.id);
          if (idx !== -1) {
            this.suppliers[idx] = { ...this.formData, id: this.editingSupplier.id };
          }
        } else if (res && res.id) {
          this.suppliers.unshift(res);
        }
        this.cdr.detectChanges();
        this.loadSuppliers();
      },
      error: (err) => {
        this.formError = err.error?.message || 'Failed to save supplier.';
        this.toast.error(this.formError);
        this.saving = false;
        this.cdr.detectChanges();
      }
    });
  }

  confirmDelete(supplier: any) {
    this.deleteTarget = supplier;
    this.deleteConfirming = true;
    this.cdr.detectChanges();
  }

  cancelDelete() {
    this.deleteTarget = null;
    this.deleteConfirming = false;
    this.cdr.detectChanges();
  }

  executeDelete() {
    if (!this.deleteTarget) return;
    const target = this.deleteTarget;
    const id = target.id;
    const previousSuppliers = [...this.suppliers];

    // Instantly close modal and remove from UI
    this.deleteConfirming = false;
    this.deleteTarget = null;
    this.suppliers = this.suppliers.filter(s => s.id !== id);
    this.cdr.detectChanges();

    this.supplierService.delete(id).subscribe({
      next: () => {
        this.toast.success('Supplier deleted successfully.');
      },
      error: (err) => {
        this.suppliers = previousSuppliers;
        this.cdr.detectChanges();
        this.toast.error('Failed to delete supplier.');
      }
    });
  }
}
