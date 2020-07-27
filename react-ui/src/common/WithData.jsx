import React from 'react';

import { getData } from '../api/api';

const withData = (WrappedComponent) => class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.fetchData();
  }

    fetchData = async () => {
      const data = await getData(document.location.pathname);
      this.setState({ data });
    };

    render() {
      const { data } = this.state;
      // eslint-disable-next-line react/jsx-props-no-spreading
      return <WrappedComponent data={data} {...this.props} refreshData={this.fetchData} />;
    }
};

export default withData;
