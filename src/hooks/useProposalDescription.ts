import { useState, useEffect } from 'react';

export const useProposalDescription = (description:string) => {
  const [{ loadedDescription, isLoaded }, setDescription] = useState({ loadedDescription: '', isLoaded: false });

  useEffect(() => {
    const loadDescription = () => {
      fetch(description).then((x) => x.text()).then((x) => {
        setDescription({ loadedDescription: x, isLoaded: true });
      });
    };
    loadDescription();
  }, [description]);

  return { loadedDescription, isLoaded };
};
