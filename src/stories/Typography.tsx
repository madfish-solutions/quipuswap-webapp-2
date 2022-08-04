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
    <p>Paragraph</p>
    <ul>
      <li>List item 1</li>
      <li>List item 2</li>
      <li>List item 3</li>
      <li>List item 4</li>
    </ul>
    <ol>
      <li>List item 1</li>
      <li>List item 2</li>
      <li>List item 3</li>
      <li>List item 4</li>
    </ol>
    <p>
      Lollipop jelly beans liquorice. Ice cream gummies cheesecake. Chocolate cake lemon drops icing. Chocolate cake
      lemon drops icing.
    </p>
    <p>
      Lollipop jelly <strong>strong</strong> <b>beans</b> liquorice. Ice cream gummies <i>italic</i> cheesecake.
      Chocolate cake lemon drops icing. Chocolate cake lemon drops icing. Lollipop jelly beans liquorice. Ice cream
      gummies cheesecake. Chocolate cake lemon drops icing. Chocolate cake lemon drops icing. Lollipop jelly beans
      liquorice. Ice cream gummies cheesecake. Chocolate cake lemon drops icing. Chocolate cake lemon drops icing.
    </p>
    <p>
      Lollipop jelly beans liquorice. Ice cream gummies cheesecake. Chocolate cake lemon drops icing. Chocolate cake
      lemon drops icing.
    </p>
  </div>
);
