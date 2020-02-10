import 'react-app-polyfill/ie9';

import 'core-js/es/map';
import 'core-js/es/set';
import 'raf/polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './index.css';

function Tweets(props) {
  return (
    <div className="card m-4" >
      <div className="card-body">
        <div className="card-heading">
          <img src="https://picsum.photos/40" alt="Profile Image" className="img-fluid rounded-circle m-2"/>  
          <div className="my-auto">
            <h5 className="card-title">{props.data.name}</h5>
            <h6 className="card-subtitle mb-2 text-muted">@{props.data.scrname}</h6>
          </div>
          <span className="ml-auto">{new Date(props.data.created).toDateString().split(" ").slice(1,4).join(" ")}</span>
        </div>
        <p className="card-text">{props.data.tweet}</p>
        <p>
          <span><i className="far fa-heart"></i>{props.data.fav}</span>
          <span><i className="fas fa-retweet"></i>{props.data.rts}</span>
        </p>
      </div>
    </div>
  );
}

class App extends React.Component{
  
    constructor(props) {
      super(props);
      this.state = {
        search : '',
        users: [],
        selectedUser: {},
        userTweets:[],
        tweetsLoaded: false,
        loading: true,
        class: "bar",
      };
  
      // This binding is necessary to make `this` work in the callback
      this.getUsers = this.getUsers.bind(this);
      this.changePage = this.changePage.bind(this);
    }
    
    changePage() {
      this.setState({
        class: "barTop",
        selectedUser: this.state.users[0]
      },() => {
        this.getTweets(this.state.selectedUser.id);
      })
    }

    getUsers = (query) => {
        var self = this;
        if (query){
            axios({ method: 'get', url: 'https://serene-crag-06856.herokuapp.com/api/users?q=' + query, responseType: 'json' })
            .then( (response) => {
                console.log(response.data);
                self.setState({
                    users: response.data.users,
                    loading: false
                })
            });
        }
    }

    getTweets = (query) => {
      var self = this;
        if (query){
            axios({ method: 'get', url: 'https://serene-crag-06856.herokuapp.com/api/tweets?uid=' + query, responseType: 'json' })
            .then(function (response) {
                console.log(response.data.tweets);
                self.setState({
                  userTweets: [...response.data.tweets],
                  tweetsLoaded: true,
                })
            });
        }
    }

    dataChange = (e) => {
      this.setState({
        search: e.target.value,
      });
      this.getUsers(e.target.value);
    }
  
    render(){
      return (
        <>
          <div className={this.state.class}>
            <div id="title" className="d-none d-sm-inline-block d-lg-inline-block d-xl-dlock">
            <span>TWEET</span><i className="fab fa-twitter bar-fa-twitter"></i><span>SEARCH</span>
            </div>
            <div id="search-bar">
              <i className="fa fa-search bar-fa-search"></i>
              <input type="text" name="search" list="users" value={this.state.search} 
                onChange={ this.dataChange.bind(this) } />
              <datalist id="users">
                { this.state.loading ? "" : this.state.users.map( (data,i) => <option value={data.name} key={i}>@{data.screen_name}</option>)}
              </datalist>
            </div>
            <button className="btn btn-primary" onClick={this.changePage}>Search</button>
          </div>
          { this.state.tweetsLoaded ?
          <div className="content">
            { this.state.userTweets.map( (tweets,i) => <Tweets key={i} data={{
              name: this.state.selectedUser.name,
              scrname: this.state.selectedUser.screen_name,
              tweet: tweets.text,
              imageUrl: this.state.selectedUser.proImage,
              rts: tweets.retweets,
              fav: tweets.favourites,
              created: tweets.created
            }}/>) }
          </div> : ""}
        </>
      );
    }
  }
  
ReactDOM.render(<App />, document.getElementById('root'));