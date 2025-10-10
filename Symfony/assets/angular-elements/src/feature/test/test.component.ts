import { HttpClient, httpResource } from '@angular/common/http';
import { Component, computed, inject, input, output, signal } from '@angular/core';

type User = {
  id: number;
  name: string;
  email: string;
};

@Component({
  standalone: true,
  selector: 'app-test',
  imports: [],
  template: `
    <h4>{{ title }}</h4>

    <div class="mb-3">
      <p>
        Input: <strong>{{ input() }}</strong>
      </p>

      <p>
        Signal: <strong>{{ text() }}</strong>
      </p>

      <button class="btn btn-primary me-1" (click)="reload()">Charger</button>
      <button class="btn btn-primary" (click)="emit()">Emit</button>
    </div>

    <div>
      <p>
        Page: {{ currentPage() }}
      </p>

      <div>
        @if (usersResource.isLoading()) {
          <span>Chargement...</span>
        } @else if (usersResource.error()) {
          <span>Error</span>
        } @else {
          <ul>
            @for (user of usersResource.value(); track user.id) {
              <li>{{ user.name }} ({{ user.email }})</li>
            }
          </ul>
        }
      </div>

      <p>
        <button class="btn btn-primary me-1" [disabled]="currentPage() <= 1" [class.disabled] (click)="prevPage()">Précédent</button>
        <button class="btn btn-primary me-1" (click)="nextPage()">Suivant</button>
        <button class="btn btn-primary" (click)="usersResource.reload()">Récharger</button>
      </p>
    </div>

  `,
  styles: [],
})
export class TestComponent {
  input = input<string>('vide');
  output = output<string>();

  httpClient = inject(HttpClient);

  title = 'Angular élément';

  state = signal<{ text: string }>({
    text: '',
  });

  text = computed(() => this.state().text);

  apiUrl = 'https://jsonplaceholder.typicode.com/users';
  currentPage = signal(1);

  usersResource = httpResource<Array<User>>(
    () => `${this.apiUrl}?page=${this.currentPage()}`,
    { defaultValue: [] }
  );

  // userDetailResource = httpResource(() => ({
  //   url: `${this.apiUrl}/users`,
  //   method: 'POST',
  //   body: { page: this.currentPage() },
  //   headers: { 'X-Custom-Header': 'value' },
  // }));

  // import { toObservable, toSignal } from '@angular/core/rxjs-interop';
  // import { debounceTime } from 'rxjs';
  //
  // debouncedQuery = toSignal(
  //   toObservable(this.searchQuery).pipe(debounceTime(300)),
  //   { initialValue: '' }
  // );

  prevPage() {
    if (this.currentPage() <= 1) return;

    this.currentPage.update(current => current - 1);
  }

  nextPage() {
    this.currentPage.update(current => current + 1);
  }

  reload() {
    this.httpClient
      .get('https://jsonplaceholder.typicode.com/posts/1')
      .subscribe((res: any) => this.state.update(s => ({ ...s, text: res.body })));
  }

  emit() {
    this.output.emit('Hello Symfony from Angular ' + Math.floor(Math.random() * 100));
  }
}
