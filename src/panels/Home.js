import React from 'react';
import { Panel, Button, Group, Div, PanelHeader, File } from '@vkontakte/vkui';
import Icon24Document from '@vkontakte/icons/dist/24/document';
import Icon24Camera from '@vkontakte/icons/dist/24/camera';

const Home = ({ id, go, onFileChange }) => {
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
						onChange={onFileChange}
					>
						Загрузить файл
					</File>
				</Div>
				<Div>
					<Button before={<Icon24Camera />} size="xl" level="2" onClick={go} data-to="persik">
						Сделать фото
					</Button>
				</Div>
			</Group>
		</Panel>
	)
};

export default Home;
