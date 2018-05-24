import { TestBed, async } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { By } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ByUsernamePipe } from './app.pipe';

describe('AppComponent', () => {

  let fixture, app, compiled;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpModule
      ],
      declarations: [
        AppComponent,
        ByUsernamePipe
      ],
      providers: [ ByUsernamePipe ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.debugElement.componentInstance;
    compiled = fixture.debugElement.nativeElement;    
  }));
  it('Creo la App', async(() => {    
    expect(app).toBeTruthy();
  }));
  it('Deberia mostrar el texto del label', async(() => {
    fixture.detectChanges();
    expect(compiled.querySelector('label').textContent).toContain('Ingresa un nombre de usuario');
  }));

  it('Pruebo si trae los 200 usuarios', async(() => {
    app.readUsers().subscribe(
      users => {
        expect(users.length).toBe(200);
      }
    )
  }));

  it('Modificar el miembro "search" a "no" deberia reflejarse en el input', async(() => {
    app.search = 'no';
    fixture.detectChanges();
    const inputField = compiled.querySelector('input');
    inputField.dispatchEvent(new Event('input'));
    fixture.whenStable().then(() => {
      expect(inputField.value).toBe('no');
    })
  }));

  it('Con el texto "no" deberia mostrar 4 registros', async(() => {
    app.readUsers().subscribe(
      users => {
        app.users = users;
        fixture.detectChanges();
        const inputField = compiled.querySelector('input');
        app.search = 'no';
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          inputField.dispatchEvent(new Event('keyup'));
          fixture.detectChanges();
          fixture.whenStable().then(() => {          
            expect(app.filteredUsers.length).toBe(4);    
          });
        });
      }
    )
  }));  
});
