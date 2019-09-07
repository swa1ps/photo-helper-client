import React from 'react';
import PropTypes from 'prop-types';
import { Panel, Button, Group, Div, PanelHeader, File } from '@vkontakte/vkui';
import Icon24Document from '@vkontakte/icons/dist/24/document';

const Home = ({ id, go }) => {
	const [href, setHref] = React.useState(null)

	function handleChangeFile(e) {
		console.log(e)
		setHref(URL.createObjectURL(e.target.files[0]));
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
					href && (
						<img className="Preview" src={href} alt=""/>
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
