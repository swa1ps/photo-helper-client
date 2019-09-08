import React from 'react';
import PropTypes from 'prop-types';
import { Panel, PanelHeader, HeaderButton, Group, Spinner, Button } from '@vkontakte/vkui';
import './Persik.css';
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
	
	makePhoto = (e) => {
		console.log('sdf');
	}

  detectFrame = (video, model) => {
    model.detect(video).then(predictions => {
			const hasPerson = predictions.some(p => p.class === 'person');
			this.setState({
				hasPerson
			})

      this.renderPredictions(predictions);
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

      ctx.strokeStyle = "#00FFFF";
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, width, height);

      ctx.fillStyle = "#00FFFF";
      const textWidth = ctx.measureText(prediction.class).width;
      const textHeight = parseInt(font, 10);
      ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
    });

    predictions.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];

      ctx.fillStyle = "#000000";
      ctx.fillText(prediction.class, x, y);
    });
  };


  render() {
		const props = this.props;
		const Icon = this.state.hasPerson ? Icon28CancelOutline : Icon24Camera;
		const text = this.state.hasPerson ? 'СРОЧНО УБЕРИТЕ ЛЮДЕЙ!!!!!!' : 'Сфотографировать';

    return (
				<Panel id={props.id}>
					<PanelHeader
						left={<HeaderButton onClick={props.go} data-to="home">
							<Icon24Back/>
						</HeaderButton>}
					>
						Результаты
					</PanelHeader>
					<Group>
						{
							this.state.isLoading ? (
								<div className='Preloader'>
									<Spinner className="Spinner" /> <span>Подготовка помощника</span>
								</div>
							) : (
								<Button
									size="xl"
									level="2"
									onClick={this.makePhoto} before={<Icon />}
									disabled={this.state.hasPerson}
								>
									{text}
								</Button>
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
						</section>
					</Group>
				</Panel>

    );
  }
}
Persik.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default Persik;
