import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class LoginForm extends Component {
  state = {
    userId: '',
    pin: '',
    showErrorMsg: false,
    errorMsg: '',
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showErrorMsg: true, errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {userId, pin} = this.state
    const userCredentials = {
      user_id: userId,
      pin,
    }
    const url = 'https://apis.ccbp.in/ebank/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userCredentials),
    }
    const response = await fetch(url, options)
    const fetchedData = await response.json()
    if (response.ok) {
      this.onSubmitSuccess(fetchedData.jwt_token)
    } else {
      this.onSubmitFailure(fetchedData.error_msg)
    }
  }

  onChangeUserId = event => {
    this.setState({userId: event.target.value})
  }

  onChangePin = event => {
    this.setState({pin: event.target.value})
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    const {userId, pin, showErrorMsg, errorMsg} = this.state
    return (
      <div className="login-form-container">
        <div className="logo-form-container">
          <div className="logo-container">
            <img
              className="login-image"
              src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
              alt="website login"
            />
          </div>
          <form className="form-container" onSubmit={this.onSubmitForm}>
            <h1 className="form-heading">Welcome Back!</h1>
            <label htmlFor="userId" className="style-label">
              User ID
            </label>
            <input
              id="userId"
              type="text"
              value={userId}
              onChange={this.onChangeUserId}
              placeholder="Enter User ID"
              className="style-input"
            />
            <label htmlFor="pin" className="style-label">
              PIN
            </label>
            <input
              id="pin"
              type="password"
              value={pin}
              onChange={this.onChangePin}
              placeholder="Enter PIN"
              className="style-input"
            />
            <button className="login-button" type="submit">
              Login
            </button>
            {showErrorMsg && <p className="style-error-msg">{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default LoginForm
