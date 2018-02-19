import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import { withRouter } from 'react-router';
import { router } from 'modules/common/utils';
import { queries, mutations } from '../graphql';
import gql from 'graphql-tag';
import { Alert } from 'modules/common/utils';
import { Properties } from '../components';

const PropertiesContainer = props => {
  const { fieldsGroupsQuery, history, fieldsGroupsRemove } = props;
  const fieldsgroups = fieldsGroupsQuery.fieldsgroups || [];

  if (!router.getParam(history, 'type')) {
    router.setParams(history, { type: 'Customer' });
  }

  const removePropertyGroup = ({ _id }) => {
    fieldsGroupsRemove({
      variables: { _id }
    })
      .then(() => {
        fieldsGroupsQuery.refetch();
        Alert.success('Successfully Removed');
      })
      .catch(e => {
        Alert.error(e.message);
      });
  };

  const currentType = router.getParam(history, 'type');

  const updatedProps = {
    ...props,
    fieldsgroups,
    currentType,
    removePropertyGroup
  };

  return <Properties {...updatedProps} />;
};

PropertiesContainer.propTypes = {
  queryParams: PropTypes.object,
  fieldsGroupsQuery: PropTypes.object.isRequired,
  history: PropTypes.object,
  fieldsGroupsRemove: PropTypes.func.isRequired
};

export default compose(
  graphql(gql(queries.fieldsgroups), {
    name: 'fieldsGroupsQuery',
    options: ({ queryParams }) => ({
      variables: {
        contentType: queryParams.type
      }
    })
  }),
  graphql(gql(mutations.fieldsGroupsRemove), {
    name: 'fieldsGroupsRemove'
  })
)(withRouter(PropertiesContainer));
