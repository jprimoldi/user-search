import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { User } from './user.model';
import { ByUsernamePipe } from './app.pipe';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	search: string;
	users: Array<User> = [];
	filteredUsers: Array<User> = [];
	selectedOptionData: User;
	showOptions = false;
	userNoExist = false;
	getUsersError = false;
	
	itemHover: number;

    constructor(private http: Http, private byUsernamePipe: ByUsernamePipe) {}

	ngOnInit() {
		this.readUsers().subscribe(
			users => {
				this.users = users;
				this.getUsersError = false;
			},
			error => this.getUsersError = true
		);
	}

	readUsers(): Observable<any> {
		return new Observable(observer => {
			this.http.get('/assets/users.json').subscribe(
				response => {
					observer.next(response.json());
					observer.complete();
				});
		});
	}
	  
	setAutocompleteList(event) {
		this.navigateOptions(event);
		this.filteredUsers = this.byUsernamePipe.transform(this.users, event.target.value);
		this.userNoExist = event.target.value && !this.filteredUsers.length;

		if (this.userNoExist) {
			this.selectedOptionData = null;
		}
	}

	navigateOptions(event) {
		switch (event.keyCode) {
			case 13: // Enter
				this.selectOption(this.filteredUsers[this.itemHover]);
				break;
			case 27: // ESC
				this.showOptions = false;
				break;
			case 38: // ARROW UP
				this.setHoverOption(-1);
				break;
			case 40: // ARROW DOWN
				this.setHoverOption(+1);
				break;		
			default:
				this.showOptions = true;
				break;
		}

		if (!event.target.value) {
			this.selectedOptionData = null;
		}
	}

	setHoverOption(moveIndex) {
		let currentIndex,
			newIndex;

		if (this.filteredUsers.length) {
			currentIndex = this.itemHover;
			newIndex = currentIndex !== undefined ? (currentIndex + moveIndex) : 0;
			newIndex = newIndex < 0 ? this.filteredUsers.length - 1 : newIndex;
			newIndex = newIndex > this.filteredUsers.length - 1 ? 0 : newIndex;
			this.itemHover = newIndex;
		} else {
			this.itemHover = 0;
		}
	}

	selectOption(item: User) {
		this.selectedOptionData = item;
		this.showOptions = false;
		this.search = item.username;
	}
}
