import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { User } from '../shared/user';
import { UsersService } from '../shared/users.service';
import { CommonValidators } from '../../common/common.validator';

@Component({
  selector: 'app-user-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class UserFormComponent implements OnInit {

  form: FormGroup;
  title: string;
  user: User = new User();
  id;

  constructor(
    formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private usersService: UsersService
  ) {
    this.form = formBuilder.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      email: ['', [
        Validators.required,
        CommonValidators.email
      ]],
      phone: [],
      address: formBuilder.group({
        street: ['', Validators.minLength(3)],
        suite: [],
        city: ['', Validators.maxLength(30)],
        zipcode: ['', Validators.pattern('^([0-9]){5}([-])([0-9]){4}$')]
      })
    });
  }

  ngOnInit() {
    let id = this.route.params.subscribe(params => {
      id = params['id'];

      this.title = id ? 'Edit User' : 'New User';
      this.id = id;
      if (!id) {
        return;
      }

      this.usersService.getUser(id)
        .subscribe(
          user => this.user = user,
          response => {
            if (response.status === 404) {
              //this.router.navigate(['NotFound']);
            }
          });
    });
  }

  onSave() {
    let result;

    let userValue: any = this.form.value;
    userValue.id = this.id;


    if (userValue.id) {
      result = this.usersService.updateUser(userValue);
    } else {
      result = this.usersService.addUser(userValue);
    }

    result.subscribe(data => this.router.navigate(['users']));
  }
}
