import { Component, OnInit , ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../services/customer';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customers.html',
  styleUrls: ['./customers.scss']
})
export class Customers implements OnInit {
  customers: any[] = [];
  loading = false;
  saving = false;
  error = '';

  showForm = false;
  editingCustomer: any = null;
  formData: any = { name: '', email: '', phone: '', address: '' };
  formError = '';

  deleteTarget: any = null;
  deleteConfirming = false;

  constructor(private customerService: CustomerService, private toast: ToastService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.loadCustomers(); }

  loadCustomers() {
    this.loading = true;
    this.error = '';
    this.customerService.getAll().subscribe({
      next: (data) => {
        this.customers = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to load customers.';
        this.loading = false;
        this.cdr.detectChanges();
        this.toast.error(this.error);
      }
    });
  }

  openAddForm() {
    this.editingCustomer = null;
    this.formData = { name: '', email: '', phone: '', address: '' };
    this.formError = '';
    this.showForm = true;
    this.cdr.detectChanges();
  }

  editCustomer(customer: any) {
    this.editingCustomer = customer;
    this.formData = { ...customer };
    this.formError = '';
    this.showForm = true;
    this.cdr.detectChanges();
  }

  closeForm() {
    this.showForm = false;
    this.editingCustomer = null;
    this.formError = '';
    this.cdr.detectChanges();
  }

  saveCustomer() {
    this.saving = true;
    this.formError = '';
    this.cdr.detectChanges();

    const action = this.editingCustomer
      ? this.customerService.update(this.editingCustomer.id, this.formData)
      : this.customerService.create(this.formData);

    action.subscribe({
      next: (res: any) => {
        this.toast.success(this.editingCustomer ? 'Customer updated!' : 'Customer created!');
        this.closeForm();
        this.saving = false;
        if (this.editingCustomer) {
          const idx = this.customers.findIndex(c => c.id === this.editingCustomer.id);
          if (idx !== -1) {
            this.customers[idx] = { ...this.formData, id: this.editingCustomer.id };
          }
        } else if (res && res.id) {
          this.customers.unshift(res);
        }
        this.cdr.detectChanges();
        this.loadCustomers();
      },
      error: (err) => {
        this.formError = err.error?.message || 'Failed to save customer.';
        this.toast.error(this.formError);
        this.saving = false;
        this.cdr.detectChanges();
      }
    });
  }

  confirmDelete(customer: any) {
    this.deleteTarget = customer;
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
    const previousCustomers = [...this.customers];

    // Instantly close modal and remove from UI
    this.deleteConfirming = false;
    this.deleteTarget = null;
    this.customers = this.customers.filter(c => c.id !== id);
    this.cdr.detectChanges();

    this.customerService.delete(id).subscribe({
      next: () => {
        this.toast.success('Customer deleted successfully.');
      },
      error: (err) => {
        this.customers = previousCustomers;
        this.cdr.detectChanges();
        this.toast.error('Failed to delete customer.');
      }
    });
  }
}
