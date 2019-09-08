import React from 'react';
import { Panel, Group, PanelHeader, HeaderButton, Spinner } from '@vkontakte/vkui';
import Icon24Back from '@vkontakte/icons/dist/24/back';

const Result = ({ id, go, preview, result, isLoading }) => {

	return (
		<Panel id={id}>
			<PanelHeader
				left={
					<HeaderButton onClick={go} data-to="home">
						<Icon24Back/>
					</HeaderButton>
				}
			>Результат</PanelHeader>
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
										<img className="Preview" src={result} alt="стало"/>
									)
								}
							</Group>
						</>
					)
				}
				{
					preview && (
						<Group title="Было">
							<img className="Preview" src={preview} alt="было"/>
						</Group>
					)
				}
		</Panel>
	)
};

export default Result;
