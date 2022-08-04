import React, { FC } from 'react';

interface Props {
  label?: string;
}

export const Typography: FC<Props> = ({ label }) => (
  <div>
    <h1>{label ? label : 'Typography H1'}</h1>
    <h2>{label ? label : 'Typography H2'}</h2>
    <h3>{label ? label : 'Typography H3'}</h3>
    <h4>{label ? label : 'Typography H4'}</h4>
    <h5>{label ? label : 'Typography H5'}</h5>
    <h6>{label ? label : 'Typography H6'}</h6>
  </div>
);
