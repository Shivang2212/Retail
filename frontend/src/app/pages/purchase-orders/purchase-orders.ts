import { Component, OnInit , ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PurchaseOrderService } from '../../services/purchase-order';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-purchase-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './purchase-orders.html',
  styleUrls: ['./purchase-orders.scss']
})
export class PurchaseOrders implements OnInit {
  purchaseOrders: any[] = [];
  loading = false;
  saving = false;
  error = '';

  showForm = false;
  editingPO: any = null;
  formData: any = { supplierId: null, orderDate: '', status: 'PENDING', totalAmount: 0 };
  formError = '';

  deleteTarget: any = null;
  deleteConfirming = false;

  constructor(private poService: PurchaseOrderService, private toast: ToastService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.loadPOs(); }

  loadPOs() {
    this.loading = true;
    this.error = '';
    this.poService.getAll().subscribe({
      next: (data) => {
        this.purchaseOrders = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to load purchase orders.';
        this.loading = false;
        this.cdr.detectChanges();
        this.toast.error(this.error);
      }
    });
  }

  openAddForm() {
    this.editingPO = null;
    this.formData = { supplierId: null, orderDate: new Date().toISOString().slice(0,10), status: 'PENDING', totalAmount: 0 };
    this.formError = '';
    this.showForm = true;
    this.cdr.detectChanges();
  }

  editPO(po: any) {
    this.editingPO = po;
    this.formData = { ...po };
    this.formError = '';
    this.showForm = true;
    this.cdr.detectChanges();
  }

  closeForm() {
    this.showForm = false;
    this.editingPO = null;
    this.formError = '';
    this.cdr.detectChanges();
  }

  savePO() {
    this.saving = true;
    this.formError = '';
    this.cdr.detectChanges();

    const action = this.editingPO
      ? this.poService.update(this.editingPO.id, this.formData)
      : this.poService.create(this.formData);

    action.subscribe({
      next: (res: any) => {
        this.toast.success(this.editingPO ? 'Purchase Order updated!' : 'Purchase Order created!');
        this.closeForm();
        this.saving = false;
        if (this.editingPO) {
          const idx = this.purchaseOrders.findIndex(p => p.id === this.editingPO.id);
          if (idx !== -1) {
            this.purchaseOrders[idx] = { ...this.formData, id: this.editingPO.id };
          }
        } else if (res && res.id) {
          this.purchaseOrders.unshift(res);
        }
        this.cdr.detectChanges();
        this.loadPOs();
      },
      error: (err) => {
        this.formError = err.error?.message || 'Failed to save purchase order.';
        this.toast.error(this.formError);
        this.saving = false;
        this.cdr.detectChanges();
      }
    });
  }

  confirmDelete(po: any) {
    this.deleteTarget = po;
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
    const previousPOs = [...this.purchaseOrders];

    // Instantly close modal and remove from UI
    this.deleteConfirming = false;
    this.deleteTarget = null;
    this.purchaseOrders = this.purchaseOrders.filter(p => p.id !== id);
    this.cdr.detectChanges();

    this.poService.delete(id).subscribe({
      next: () => {
        this.toast.success('Purchase Order deleted successfully.');
      },
      error: (err) => {
        this.purchaseOrders = previousPOs;
        this.cdr.detectChanges();
        this.toast.error('Failed to delete purchase order.');
      }
    });
  }
}
