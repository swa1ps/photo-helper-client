import React from 'react';
import PropTypes from 'prop-types';
import { Panel, Button, Group, Div, PanelHeader, File, Separator, Spinner } from '@vkontakte/vkui';
import Icon24Document from '@vkontakte/icons/dist/24/document';
import Icon24Camera from '@vkontakte/icons/dist/24/camera';

function arrayBufferToBase64(buffer) {
  var binary = '';
  var bytes = [].slice.call(new Uint8Array(buffer));

  bytes.forEach((b) => binary += String.fromCharCode(b));

  return window.btoa(binary);
};

const ROUTE = 'https://api-government-dev.itlabs.io/etagi-sale/photo/api/photo_process'

const Home = ({ id, go }) => {
	const [preview, setPreview] = React.useState(null)
	const [result, setResult] = React.useState(null)
	const [isLoading, setLoading] = React.useState(false)

	// ya disk
	function downloadImage(url) {
		fetch(url).then((response) => {
			response.arrayBuffer().then((buffer) => {
				const base64Flag = 'data:image/jpeg;base64,';
				const imageStr = arrayBufferToBase64(buffer);
				setLoading(false);
				setResult(base64Flag + imageStr);
			});
		});
	}

	function handleChangeFile(e) {
		const photo = e.target.files[0];
		setPreview(URL.createObjectURL(photo));

		var formData  = new FormData();
		formData.append("photo", photo);
		
		setLoading(true);

		fetch(ROUTE, {
			method: 'POST',
			body: formData
		}).then((response) => {
				return response.json()
		}).then(json => {
			console.log(json)
			setResult(json.link);
			setLoading(false);
		});
	}

	return (
		<Panel id={id}>
			<PanelHeader>Главная</PanelHeader>
			<Group title='Загрузка картинки'>
				<Div>
					<File
						top="Загрузить"
						before={<Icon24Document />}
						size="xl"
						level="secondary"
						onChange={handleChangeFile}
					/>
				</Div>
				<Div>
					<Button before={<Icon24Camera />} size="xl" level="2" onClick={go} data-to="persik">
						Сделать фото
					</Button>
				</Div>
			</Group>
			{
					(isLoading || result) && (
						<>
							<Group title="Стало">
								{
									isLoading && (
										<div className='Preloader'>
											<Spinner className="Spinner" /> <span>Загрузка</span>
										</div>
									)
								}
								{
									!isLoading && result && (
										<>
											<Separator style={{ margin: '12px 0' }} />
											<img className="Preview" src={result} alt=""/>
										</>
									)
								}
							</Group>
						</>
					)
				}
				{
					preview && (
						<Group title="Было">
							<img className="Preview" src={preview} alt=""/>
						</Group>
					)
				}
		</Panel>
	)
};

Home.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	fetchedUser: PropTypes.shape({
		photo_200: PropTypes.string,
		first_name: PropTypes.string,
		last_name: PropTypes.string,
		city: PropTypes.shape({
			title: PropTypes.string,
		}),
	}),
};

export default Home;
