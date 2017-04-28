import React from 'react';

export default class ChatPage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			usernameText: '',
			messageText: '',
			userList: [],
			messageList: [],
		};
		this.chatTextChangeHandler = this.chatTextChangeHandler.bind(this);
		this.usernameTextChangeHandler = this.usernameTextChangeHandler.bind(this);
		this.submitMessage = this.submitMessage.bind(this);
		this.startChat = this.startChat.bind(this);
		this.renderUserList = this.renderUserList.bind(this);
		this.renderMessageList = this.renderMessageList.bind(this);
		this.initSocketEventListners = this.initSocketEventListners.bind(this);

		this.initSocketEventListners();
	}

	componentDidMount() {
		if(this.refs.usernamebox)
			this.refs.usernamebox.focus();
		else
			this.refs.chatbox.focus();
	}

	initSocketEventListners(){
		this.socket = window.io();

		this.socket.on('new user', (userList) => {
			this.setState({
				...this.state,
				userList: userList,
			});
		});

		this.socket.on('chat message', (message) => {
			this.setState({
				...this.state,
				messageList: [...this.state.messageList, message],
			});
		});

		this.socket.on('user left', (userList) => {
			this.setState({
				...this.state,
				userList: userList,
			});
		});
	}

	render() {
		if(!this.state.username)
			return this.renderSetUsernameComponent();
		else
			return this.renderChatAppComponent();
	}

	renderSetUsernameComponent() {
		return (
			<div className="container" >
				<div className="row well" style={{marginTop: "20%"}}>
					<div className="form-group">
						<label htmlFor="username">
							<h2>Enter Username to login:</h2>
						</label>
						<input id="username" type="text" className="form-control" 
							ref="usernamebox"
							value={this.state.usernameText}
							onChange={this.usernameTextChangeHandler}
							onKeyPress={e => {
								if(e.which === 13)
									this.startChat();
							}} />
						<br/>
						<button type="submit" className="btn btn-primary"
						 onClick={this.startChat}>Start Chat</button>
					</div>
				</div>
			</div>
		)
	}

	renderChatAppComponent() {
		return (
			<div className="container">
				<div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
					<h2>Users online :</h2>
					<br />
					<div className="well">
						{this.renderUserList()}
					</div>
				</div>
				<div className="col-xs-8 col-sm-8 col-md-8 col-lg-8">
					<h2>Messages: </h2>
					<div>
						{this.renderMessageList()}
					</div>
				</div>
				<div className="row">
					<div className="col-xs-8 col-sm-8 col-md-8 col-lg-8 pull-right">
						<div className="input-group">
						    <textarea className="form-control custom-control" rows="3"
						    	ref="chatbox" 
						    	style={{resize:"none"}} 
						    	value={this.state.messageText}
								onChange={this.chatTextChangeHandler}
								onKeyPress={e => {
									if(e.which === 13)
										this.submitMessage();
								}} />     
						    <span className="input-group-addon btn btn-primary"
						    	onClick={this.submitMessage}>Send</span>
					    </div>
				    </div>
				</div>
			</div>
		);
	}

	startChat() {
		this.state.username = this.state.usernameText;
		this.socket.emit('user', {
			socketId: this.socket.id,
			username: this.state.usernameText
		});
	}

	usernameTextChangeHandler(e) {
		this.setState({
			...this.state,
			usernameText: e.target.value,
		})
	}

	submitMessage() {
		this.setState({
			...this.state,
			messageText: '',
		});
		
		this.socket.emit('message', this.state.usernameText + ': ' + this.state.messageText);
	}

	chatTextChangeHandler(e) {
		this.setState({
			...this.state, 
			messageText: e.target.value,
		})
	}

	renderUserList() {
		return this.state.userList.map(user => {
			return (
				<strong key={user}>
					<span className="glyphicon glyphicon-user text-success" aria-hidden="true"></span>
					{' '}{user}{this.state.username === user ? ' (You)' : ''}
					<br />
				</strong>
			);
		});
	}

	renderMessageList() {
		return this.state.messageList.map(message => {
			return <p key={message}>{message}</p>;
		});
	}
}
