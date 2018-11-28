import { Web } from '@pnp/sp';

import { IList, IUser } from './interfaces';

export default class Service {

  private web: Web;

  constructor(webAbsoluteUrl: string = _spPageContextInfo.webAbsoluteUrl) {
    this.web = new Web(webAbsoluteUrl);
    this.web.siteUsers
  }

  public getWebTitle(): Promise<string> {
    return this.web.select('Title').get().then(({ Title }) => Title);
  }

  public getLists(): Promise<IList[]> {
    return this.web.lists.select('Id,Title').get()
      .then(lists => {
        return lists.map(({ Id, Title }) => {
          return {
            id: Id,
            title: Title
          };
        });
      });
  }

  public getSiteUsers(): Promise<IUser[]> {
    return this.web.siteUsers.select('Email,Title').get()
      .then(users => {
        return users.map(({ Email, Title }) => {
          return {
            email: Email,
            title: Title
          };
        });
      });
  }
}
