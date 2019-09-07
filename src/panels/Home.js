import React from 'react';
import PropTypes from 'prop-types';
import { Panel, Button, Group, Div, PanelHeader, File, Separator } from '@vkontakte/vkui';
import Icon24Document from '@vkontakte/icons/dist/24/document';

const Home = ({ id, go }) => {
	const [preview, setPreview] = React.useState(null)
	const [result, setResult] = React.useState(null)

	function handleChangeFile(e) {
		setPreview(URL.createObjectURL(e.target.files[0]));
		setResult(URL.createObjectURL(e.target.files[0]));
	}

	return (
		<Panel id={id}>
			<PanelHeader>Главная</PanelHeader>
			<Group>
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
					<Button size="xl" level="2" onClick={go} data-to="persik">
						Сделать фото
					</Button>
				</Div>
			</Group>
			<Group>
				{
					preview && (
						<img className="Preview" src={preview} alt=""/>
					)
				}
				{
					result && (
						<>
							<Separator style={{ margin: '12px 0' }} />
							<img className="Preview" src={result} alt=""/>
						</>
					)
				}
			</Group>
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
