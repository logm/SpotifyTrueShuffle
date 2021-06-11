import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min'
import React from 'react'
import ReactDOM from 'react-dom'
import
{
	BrowserRouter as Router,
	Switch,
	Route,
} from "react-router-dom"
import './css/main.css'
import './css/bootstrap-xxl.css'
import App from './components/App'
import reportWebVitals from './js/reportWebVitals'
import { Redirect } from './components/Auth'



ReactDOM.render(
	<React.StrictMode>
		<Router>
			<Switch>
				<Route exact path="/redirect">
					<Redirect />
				</Route>
				<Route>
					<App />
				</Route>
			</Switch>
		</Router>
	</React.StrictMode>,
	document.getElementById('root')
)


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
