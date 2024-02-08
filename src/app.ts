import { TMessage, TRoom, TUser } from './declarations';

// #region ::: UTILITIES
const getInitialUserLogged = () => {
  return !!localStorage.getItem('userLogged') ? JSON.parse(localStorage.getItem('userLogged')!) : null;
};

const getInitialRooms = () => {
  return !!localStorage.getItem('rooms') ? JSON.parse(localStorage.getItem('rooms')!) : [];
};

const getInitialUsers = () => {
  return !!localStorage.getItem('users')
    ? JSON.parse(localStorage.getItem('users')!)
    : [
        {
          id: 'secret-id',
          username: 'riccardogenova',
          password: '12345',
        },
      ];
};
// #endregion

export class AppDiscord {
  #userLogged: Pick<TUser, 'username' | 'id'> | null = getInitialUserLogged();
  #rooms: Array<TRoom> = getInitialRooms();
  #users: Array<TUser> = getInitialUsers();
  #onlineUsers: Array<TUser['id']> = [];

  constructor() {
    console.log('AppDiscord created');
    console.log('userLogged', this.#userLogged);
    console.log('rooms', this.#rooms);
    console.log('users', this.#users);
    console.log('onlineUsers', this.#onlineUsers);
  }

  #checkUserExists(username: TUser['username']) {
    const isAlreadySignup = this.#users.some(user => user.username === username);
    return isAlreadySignup;
  }
  #checkIsSuperAdmin() {
    if (!this.#userLogged) throw new Error('You are not logged in');
    const isSuperAdmin = this.#userLogged.id === 'secret-id';
    return isSuperAdmin;
  }
  signup({ username, password }: { username: TUser['username']; password: TUser['password'] }) {
    if (!!this.#userLogged) throw new Error('You are already logged in');

    const isAlreadySignup = this.#checkUserExists(username);
    if (isAlreadySignup) throw new Error('User already exists');
    else {
      const newUser: TUser = { id: Math.random().toString(), username, password };
      this.#users = [...this.#users, newUser];
      console.log(`User ${newUser.username} created`);
      const user = this.login({ username, password });
      localStorage.setItem('users', JSON.stringify(this.#users));
      return user;
    }
  }
  login({ username, password }: { username: TUser['username']; password: TUser['password'] }) {
    if (!!this.#userLogged) throw new Error('You are already logged in');

    const user = this.#users.find(user => user.username === username && user.password === password);
    if (!user) throw new Error('User not found');
    else {
      this.#userLogged = { username: user.username, id: user.id };
      this.#onlineUsers = [...this.#onlineUsers, user.id];
      console.log(`User ${user.username} logged in`);
      localStorage.setItem('userLogged', JSON.stringify(this.#userLogged));
      return { username: user.username, id: user.id };
    }
  }
  logout() {
    const isLogged = !!this.#userLogged;
    if (!isLogged) throw new Error('You are not logged in');
    this.#onlineUsers = this.#onlineUsers.filter(id => id !== this.#userLogged!.id);
    this.#userLogged = null;
    console.log('User logged out');
  }
  getUserLogged() {
    return this.#userLogged;
  }
  getOnlineUsers() {
    const isLogged = !!this.#userLogged;
    if (!isLogged) throw new Error('You are not logged in');
    return this.#onlineUsers;
  }
  //   SUPER ADMIN
  getAllUsers() {
    const isSuperAdmin = this.#checkIsSuperAdmin();
    if (!isSuperAdmin) throw new Error('You are not allowed to do this');
    return this.#users;
  }
  getAllRooms() {
    const isSuperAdmin = this.#checkIsSuperAdmin();
    if (!isSuperAdmin) throw new Error('You are not allowed to do this');
    return this.#rooms;
  }
  createRoom(name: TRoom['name']) {
    const isLogged = !!this.#userLogged;
    if (!isLogged) throw new Error('You are not logged in');

    const room: TRoom = {
      id: Math.random().toString(),
      name,
      messages: [],
      users: [{ idUser: this.#userLogged!.id, permission: 'admin' }],
      private: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.#rooms = [...this.#rooms, room];
    console.log(`Room ${room.name} created`);
    localStorage.setItem('rooms', JSON.stringify(this.#rooms));
    return room;
  }

  deleteRoom(id: TRoom['id']) {
    const isLogged = !!this.#userLogged;
    if (!isLogged) throw new Error('You are not logged in');

    const isSuperAdmin = this.#checkIsSuperAdmin();
    if (!isSuperAdmin) throw new Error('You are not allowed to do this');

    this.#rooms = this.#rooms.filter(room => room.id !== id);
    console.log(`Room ${id} deleted`);
    localStorage.setItem('rooms', JSON.stringify(this.#rooms));
  }

  getRoomList() {
    const isLogged = !!this.#userLogged;
    if (!isLogged) throw new Error('You are not logged in');

    const filteredPublicRooms = this.#rooms.filter(room => !room.private);
    const filteredRooms = filteredPublicRooms.map(room => ({ id: room.id, name: room.name }));
    return filteredRooms;
  }

  sendMessage() {
    const message: TMessage = {
      id: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      content: '',
      idUser: '',
      idRoom: '',
      ref: ''
    }

    let messages: Array<TMessage> = []
    messages = [...messages, message];
    console.log(`Message sent`);
    return messages;
}

  deleteMessage(id: TMessage['id']) {
    const message: TMessage = {
      id: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      content: '',
      idUser: '',
      idRoom: '',
      ref: ''
    }

    let messages: Array<TMessage> = []
    messages = messages.filter(message => message.id !== message.id);
    console.log(`Message deleted`);
    return messages;

  } 

}


