import { Component, OnInit , ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.html',
  styleUrls: ['./categories.scss']
})
export class Categories implements OnInit {
  categories: any[] = [];
  loading = false;
  saving = false;
  error = '';

  showForm = false;
  editingCategory: any = null;
  formData: any = { name: '', description: '' };
  formError = '';

  deleteTarget: any = null;
  deleteConfirming = false;

  constructor(
    private categoryService: CategoryService,
    private toast: ToastService
  , private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.loadCategories(); }

  loadCategories() {
    this.loading = true;
    this.error = '';
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.status === 401 ? 'Session expired. Please log in again.'
                   : err.status === 403 ? 'You do not have permission to view categories.'
                   : err.status === 0   ? 'Cannot reach server. Check your connection.'
                   : 'Failed to load categories.';
        this.loading = false;
        this.cdr.detectChanges();
        this.toast.error(this.error);
      }
    });
  }

  openAddForm() {
    this.editingCategory = null;
    this.formData = { name: '', description: '' };
    this.formError = '';
    this.showForm = true;
    this.cdr.detectChanges();
  }

  editCategory(category: any) {
    this.editingCategory = category;
    this.formData = { ...category };
    this.formError = '';
    this.showForm = true;
    this.cdr.detectChanges();
  }

  closeForm() {
    this.showForm = false;
    this.editingCategory = null;
    this.formError = '';
    this.cdr.detectChanges();
  }

  validateForm(): string {
    if (!this.formData.name?.trim()) return 'Category name is required.';
    return '';
  }

  saveCategory() {
    const err = this.validateForm();
    if (err) { this.formError = err; return; }

    this.saving = true;
    this.formError = '';
    this.cdr.detectChanges();

    const action = this.editingCategory
      ? this.categoryService.update(this.editingCategory.id, this.formData)
      : this.categoryService.create(this.formData);

    action.subscribe({
      next: (res: any) => {
        this.toast.success(this.editingCategory ? 'Category updated successfully!' : 'Category created successfully!');
        this.closeForm();
        this.saving = false;
        if (this.editingCategory) {
          const idx = this.categories.findIndex(c => c.id === this.editingCategory.id);
          if (idx !== -1) {
            this.categories[idx] = { ...this.formData, id: this.editingCategory.id };
          }
        } else if (res && res.id) {
          this.categories.unshift(res);
        }
        this.cdr.detectChanges();
        this.loadCategories();
      },
      error: (err) => {
        this.formError = err.status === 409 ? 'A category with this name already exists.'
                       : err.status === 403 ? 'You do not have permission to do this.'
                       : err.status === 400 ? 'Invalid data. Please check your inputs.'
                       : err.error?.message || 'Failed to save category.';
        this.toast.error(this.formError);
        this.saving = false;
        this.cdr.detectChanges();
      }
    });
  }

  confirmDelete(category: any) {
    this.deleteTarget = category;
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
    const name = target.name;
    const previousCategories = [...this.categories];

    // Instantly close modal and remove from UI
    this.deleteConfirming = false;
    this.deleteTarget = null;
    this.categories = this.categories.filter(c => c.id !== id);
    this.cdr.detectChanges();

    this.categoryService.delete(id).subscribe({
      next: () => {
        this.toast.success(`"${name}" deleted successfully.`);
      },
      error: (err) => {
        // Revert on error
        this.categories = previousCategories;
        this.cdr.detectChanges();
        const msg = err.status === 403 ? 'You do not have permission to delete this category.'
                  : err.status === 404 ? 'Category not found — it may have already been deleted.'
                  : err.status === 409 ? 'Cannot delete category because it is in use.'
                  : 'Failed to delete category.';
        this.toast.error(msg);
      }
    });
  }
}
