import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { postData } from '../api/api';
import withData from '../common/WithData';

const Types = ({ data, refreshData }) => {
  const [shouldShowAddPanel, setShouldShowAddPanel] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const name = document.getElementById('typeName').value;
    if (name) {
      const response = await postData('/types', { name });
      if (response) {
        refreshData();
        setShouldShowAddPanel(false);
      }
    }
  };

  return (
    <>
      <h2>Food Types</h2>
      {data && (
        <ul>
          {data.map(({ id, name }) => (
            <li key={id}>
              <Link to={`/types/${id}`}>{name}</Link>
            </li>
          ))}
        </ul>
      )}
      <Button
        type="button"
        onClick={() => setShouldShowAddPanel(true)}
        disabled={shouldShowAddPanel}
      >
        Add New Type
      </Button>
      {shouldShowAddPanel && (
        <Form id="newTypeForm" onSubmit={handleSubmit}>
          <Form.Group controlId="typeName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" />
          </Form.Group>
          <Button variant="secondary" type="submit">
            Submit
          </Button>
        </Form>
      )}
    </>
  );
};

Types.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
  ),
  refreshData: PropTypes.func.isRequired,
};

Types.defaultProps = {
  data: null,
};

export default withData(Types);
