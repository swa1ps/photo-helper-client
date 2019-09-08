import React from 'react';
import { View } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';
import Persik from './panels/Persik';
import Result from './panels/Result';

const ROUTE = 'https://api-government-dev.itlabs.io/etagi-sale/photo/api/photo_process'

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			activePanel: 'home',
			isLoading: false,
			result: null,
			preview: null
		};
	}

	handleChangeFile = (e) => {
		const photo = e.target.files[0];

		var formData  = new FormData();
		formData.append("photo", photo);
		
		this.setState({
			isLoading: true,
			preview: URL.createObjectURL(photo),
			activePanel: 'result'
		})

		fetch(ROUTE, {
			method: 'POST',
			body: formData
		})
		.then(response => response.json())
		.then(json => {
			this.setState({
				isLoading: false,
				result: json.link
			})
		});
	}

	go = (e) => {
		this.setState({ activePanel: e.currentTarget.dataset.to })
	};

	render() {
		const { result, preview, isLoading } = this.state;
		return (
			<View activePanel={this.state.activePanel}>
				<Home id="home" go={this.go} onFileChange={this.handleChangeFile}  />
				<Persik id="persik" onFileChange={this.handleChangeFile} go={this.go} />
				<Result id="result" go={this.go} result={result} preview={preview} isLoading={isLoading} />
			</View>
		);
	}
}

export default App;
