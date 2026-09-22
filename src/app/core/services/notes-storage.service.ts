import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { LocalNote } from '../models/local-note.model';

const INDEX_KEY = 'notes_index';

/**
 * Persistencia local (Ionic Storage, sobre IndexedDB) para notas de
 * entrenamiento: viven solo en el dispositivo, no pasan por el backend,
 * y sobreviven a cerrar/reabrir la app.
 */
@Injectable({ providedIn: 'root' })
export class NotesStorageService {
  private store: Storage | null = null;
  private readonly ready: Promise<void>;

  constructor(private storage: Storage) {
    this.ready = this.init();
  }

  private async init(): Promise<void> {
    this.store = await this.storage.create();
  }

  private async db(): Promise<Storage> {
    await this.ready;
    return this.store as Storage;
  }

  async list(): Promise<LocalNote[]> {
    const db = await this.db();
    const ids: string[] = (await db.get(INDEX_KEY)) ?? [];
    const notes = await Promise.all(ids.map((id) => db.get(`note_${id}`)));
    return notes
      .filter((note): note is LocalNote => !!note)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async create(title: string, content: string): Promise<LocalNote> {
    const db = await this.db();
    const now = new Date().toISOString();
    const note: LocalNote = { id: crypto.randomUUID(), title, content, createdAt: now, updatedAt: now };

    const ids: string[] = (await db.get(INDEX_KEY)) ?? [];
    ids.push(note.id);
    await db.set(INDEX_KEY, ids);
    await db.set(`note_${note.id}`, note);
    return note;
  }

  async update(id: string, title: string, content: string): Promise<LocalNote | null> {
    const db = await this.db();
    const existing: LocalNote | null = await db.get(`note_${id}`);
    if (!existing) {
      return null;
    }
    const updated: LocalNote = { ...existing, title, content, updatedAt: new Date().toISOString() };
    await db.set(`note_${id}`, updated);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const db = await this.db();
    const ids: string[] = (await db.get(INDEX_KEY)) ?? [];
    await db.set(
      INDEX_KEY,
      ids.filter((existingId) => existingId !== id)
    );
    await db.remove(`note_${id}`);
  }
}
