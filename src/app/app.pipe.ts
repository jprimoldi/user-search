import { Pipe, PipeTransform } from '@angular/core';
import { User } from './user.model';

@Pipe({
	name: 'byUsernamePipe',
	pure: false
})
export class ByUsernamePipe implements PipeTransform {
	transform(items: User[], keyword: string): any {
		return items.filter((item: User) => {
			const reg = new RegExp(keyword, 'gi');
			return keyword ? item.username.match(reg) : false;
		});
	}
}