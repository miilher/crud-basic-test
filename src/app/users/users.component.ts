import { Component, OnInit } from '@angular/core';
import { UsersService} from './shared/users.service';
import { User } from './shared/user';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  private users: User[] = [];

  constructor(private usersService: UsersService) { }

  ngOnInit() {
    this.loadUsers();
  }
  loadUsers() {
    this.usersService.getUsers()
      .subscribe(data => this.users = data);
  }

  deleteUser(user) {
    if (confirm('Tem certeza que deseja deletar ' + user.name + '?')) {
      let index = this.users.indexOf(user);
      this.users.splice(index, 1);

      this.usersService.deleteUser(user.id)
        .subscribe(null,
          err => {
            alert('Não é possível deletar/1');
            this.users.splice(index, 0, user);
          });
    }
  }

}
