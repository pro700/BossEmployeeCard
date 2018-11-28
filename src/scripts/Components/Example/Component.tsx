import * as React from 'react';
import Api from './operations';
import { IProps, IState } from './interfaces';

export default class Example extends React.Component<IProps, IState> {

  private api: Api;

  constructor(props: IProps) {
    super(props);
    this.api = new Api();
    this.state = { isLoading: true };
  }

  public render() {
    return (
      <>
        {this.state.isLoading && (
          <div>Loading...</div>
        )}
        {!this.state.isLoading && (
          <>
            <h2>Web title: {this.state.title}</h2>
            <h3>Lists: </h3>
            <ul>
              {this.state.lists.map(list => {
                return <li key={list.id}>{list.title}</li>;
              })}
            </ul>
            <h3>Site users: </h3>
            <ul>
              {this.state.users.map(user => {
                return <li key={user.email}>{user.title}</li>;
              })}
            </ul>
          </>
        )}
      </>
    );
  }

  public componentDidMount() {
    this.setState({ isLoading: true });
    Promise.all([
      this.api.getWebTitle(),
      this.api.getLists(),
      this.api.getSiteUsers()
    ]).then(([title, lists, users]) => {
      this.setState({
        isLoading: false,
        title,
        lists,
        users
      });
    });
  }

}
