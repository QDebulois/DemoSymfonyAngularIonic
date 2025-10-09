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
    <p>Voici {{ title }}</p>

    <p>
      {{ input() }}
    </p>

    <p>
      {{ text() }}
    </p>

    <button (click)="reload()">Reload</button>
    <button (click)="emit()">Emit</button>

    <p>
      {{ currentPage() }}
    </p>
    @if (usersResource.isLoading()) {
      <div>Loading users...</div>
    } @else if (usersResource.error()) {
      <div>Error: </div>
    } @else {
      <ul>
        @for (user of usersResource.value(); track user.id) {
          <li>{{ user.name }} ({{ user.email }})</li>
        }
      </ul>
      <button (click)="nextPage()">Next Page</button>
      <button (click)="usersResource.reload()">Reload Manually</button>
    }

  `,
  styles: [],
})
export class TestComponent {
  input = input<string>('vide');
  output = output<string>();

  httpClient = inject(HttpClient);

  title = 'angular élément';

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

  nextPage() {
    this.currentPage.update(current => current + 1);
  }

  reload() {
    this.httpClient
      .get('https://jsonplaceholder.typicode.com/posts/1')
      .subscribe((res: any) => this.state.update(s => ({ ...s, text: res.body })));
  }

  emit() {
    this.output.emit('Output from angular elements ' + Math.floor(Math.random() * 100));
  }
}
