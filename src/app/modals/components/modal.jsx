import React from 'react'
import { IconClose } from './../../common/icons.jsx'
import Progress from './../../common/progress.jsx'

const Modal = ({ id, close, children }) => {
	return (
		<div id={id} className="modal-content">
			<div className="hide small-show">
				<Progress />
			</div>

			<div className="row">
				<div className="modal-close col col-12-of-12 text-right">
					<div className="modal-btn-close cursor-pointer inlineblock" onClick={close}>
						<IconClose />
					</div>
				</div>

				<div className="modal-copy col col-12-of-12 center">
					{children}
				</div>
			</div>
		</div>
	)
}

export default Modal
