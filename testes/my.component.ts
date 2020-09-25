import { Component } from '@angular/core';
@Component({
  selector: 'my',
  template: 'hello me.'
})
export class MyComponent {

  testeCondicao() {
    let condicao = true;
    if (condicao) {
      condicao = false;
    }
  }
}