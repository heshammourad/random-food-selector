import { getData } from '../api/api';

import React from 'react';

const withData = (WrappedComponent) => class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const data = await getData(document.location.pathname);
    this.setState({ data });
  }

  render() {
    const { data } = this.state;
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <WrappedComponent data={data} {...this.props} />;
  }
};

export default withData;
