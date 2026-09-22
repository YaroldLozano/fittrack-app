import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { NotesStorageService } from '../core/services/notes-storage.service';
import { LocalNote } from '../core/models/local-note.model';

@Component({
  selector: 'app-notes',
  templateUrl: 'notes.page.html',
  styleUrls: ['notes.page.scss'],
  standalone: false,
})
export class NotesPage implements OnInit {
  notes: LocalNote[] = [];
  isLoading = true;

  showForm = false;
  editingId: string | null = null;
  title = '';
  content = '';
  formError = '';

  constructor(
    private notesStorage: NotesStorageService,
    private alertCtrl: AlertController,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadNotes();
  }

  async loadNotes(): Promise<void> {
    this.isLoading = true;
    try {
      this.notes = await this.notesStorage.list();
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  newNote(): void {
    this.editingId = null;
    this.title = '';
    this.content = '';
    this.formError = '';
    this.showForm = true;
  }

  editNote(note: LocalNote): void {
    this.editingId = note.id;
    this.title = note.title;
    this.content = note.content;
    this.formError = '';
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
  }

  async submit(): Promise<void> {
    if (!this.title.trim()) {
      this.formError = 'El título es requerido';
      return;
    }

    if (this.editingId) {
      await this.notesStorage.update(this.editingId, this.title.trim(), this.content.trim());
    } else {
      await this.notesStorage.create(this.title.trim(), this.content.trim());
    }

    this.showForm = false;
    await this.loadNotes();
  }

  async remove(note: LocalNote): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar nota',
      message: '¿Eliminar esta nota? Esta acción no se puede deshacer.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.notesStorage.remove(note.id);
            await this.loadNotes();
          },
        },
      ],
    });
    await alert.present();
  }
}
