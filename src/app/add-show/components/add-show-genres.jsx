import React, { useState, Fragment } from 'react'
import { Link } from 'react-router-dom'
import union from 'lodash/union'
import clone from 'lodash/clone'
import Modal from './../../modals/index.jsx'
import InputGenre from './../../forms/input-genre.jsx'

const ModalGenre = ({ slug, value = [], viewportName, isVisible, onInputChange, onClose }) => {
	const [ genres, setGenres ] = useState(clone(union([], value)))

	return (
		<Fragment>
			<div className="modal-header">
				<h2 className={`${viewportName === 'small' ? 'typography-subheadline' : 'typography-headline'}`}>
					We need help understanding this show
				</h2>
			</div>

			<p>What genres best describe this show? Please select up to 3 additional genres.</p>
			<InputGenre
				limit={3}
				value={genres.map(g => ({ label: g, value: g }))}
				placeholder="Search Additional Genres (Max. 3)"
				onInputChange={(value) => {
					setGenres(value.map(v => v.value))
				}} />

			<div
				className="modal-controls"
				style={{
					textAlign: 'right',
				    marginTop: '2rem',
				}}>
				<button
					id="editprofile-finish"
					type="submit"
					className="btn btn--primary btn--noborder"
					style={{ width: 'auto' }}
					onClick={onClose}>
					Later
				</button>
				<Link
					to={slug ? `/shows/${slug}/edit/4` : `/add/4`}
					id="editprofile-finish"
					className={`btn ${(genres.length > 0) ? 'btn--success' : 'btn--disabled'}`}
					onClick={() => {
						onInputChange(genres)
						onClose()
					}}>
					Continue
				</Link>
			</div>
		</Fragment>
	)
}

const AddShowGenres = (props) => (
	<Modal id="modal-add-genres" isVisible={props.isVisible} onClose={props.onClose}>
		<ModalGenre {...props} />
	</Modal>
)

export default React.memo(AddShowGenres)
