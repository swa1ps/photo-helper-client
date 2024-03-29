import React from 'react';
import { Panel, PanelHeader, HeaderButton, Group, Spinner, File } from '@vkontakte/vkui';
import './Persik.css';
import noPls from '../img/noPls.png';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import Icon24Camera from '@vkontakte/icons/dist/24/camera';
import Icon28CancelOutline from '@vkontakte/icons/dist/28/cancel_outline';
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

import MobileDetect from 'mobile-detect';

class Persik extends React.Component {
  videoRef = React.createRef();
	canvasRef = React.createRef();

	constructor(props) {
		super(props)
		this.state = {
			isLoading: true,
			hasPerson: false
		}
	}
	componentDidMount() {
		const md = new MobileDetect(window.navigator.userAgent);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const webCamPromise = navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            facingMode: !md.mobile() ? "user" : { exact: "environment" }
          }
        })
        .then(stream => {
          window.stream = stream;
          this.videoRef.current.srcObject = stream;
          return new Promise((resolve, reject) => {
            this.videoRef.current.onloadedmetadata = () => {
              resolve();
            };
          });
        });
      const modelPromise = cocoSsd.load();
      Promise.all([modelPromise, webCamPromise])
        .then(values => {
					this.detectFrame(this.videoRef.current, values[0]);
        })
        .catch(error => {
          console.error(error);
				})
				.finally(() => {
					this.setState({
						isLoading: false
					})
				})
    }
	}

  detectFrame = (video, model) => {
    model.detect(video).then(predictions => {
			const people = predictions.filter(p => p.class === 'person');
			const hasPerson = !!people.length;
			this.setState({
				hasPerson
			})

      this.renderPredictions(people);
      requestAnimationFrame(() => {
        this.detectFrame(video, model);
      });
    });
  };

  renderPredictions = predictions => {
    const ctx = this.canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const font = "16px sans-serif";
    ctx.font = font;
		ctx.textBaseline = "top";
    predictions.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];

      ctx.strokeStyle = "red";
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, width, height);

      ctx.fillStyle = "red";
      const textWidth = ctx.measureText(prediction.class).width;
      const textHeight = parseInt(font, 10);
      ctx.fillRect(x, y, textWidth + 15, textHeight + 4);
    });

    predictions.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];

      ctx.fillStyle = "#000000";
      ctx.fillText('Человек', x, y);
    });
  };


  render() {
		const {id, go, onFileChange} = this.props;
		const { hasPerson, isLoading } = this.state;
		const Icon = hasPerson ? Icon28CancelOutline : Icon24Camera;
		const text = hasPerson ? 'СРОЧНО УБЕРИТЕ ЛЮДЕЙ!!!!!!' : 'Сфотографировать';

    return (
				<Panel id={id}>
					<PanelHeader
						left={<HeaderButton onClick={go} data-to="home">
							<Icon24Back/>
						</HeaderButton>}
					>
						Сфотографировать
					</PanelHeader>
					<Group>
						{
							isLoading ? (
								<div className='Preloader'>
									<Spinner className="Spinner" /> <span>Подготовка помощника</span>
								</div>
							) : (
								<File
									size="xl"
									level="2"
									onChange={onFileChange} before={<Icon />}
									disabled={hasPerson}
									accept="image/*;capture=camera"
								>
									{text}
								</File>
							)
						}
						<section className="Wrapper">
							<video
								autoPlay
								playsInline
								muted
								ref={this.videoRef}
								width="400"
								height="400"
							/>
							<canvas
								className="Canvas"
								ref={this.canvasRef}
								width="400"
								height="400"
							/>
							{
								hasPerson && <img src={noPls} className="NoPls" />
							}
						</section>
					</Group>
				</Panel>

    );
  }
}

export default Persik;
