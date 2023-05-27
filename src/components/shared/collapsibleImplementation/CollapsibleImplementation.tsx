import * as React from 'react';
import './CollapsibleImplementation.css'
import Collapsible from 'react-collapsible';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface CollapsibleImplementationProps {
  children: React.ReactNode
}

/**
* The component used in this app that implements `react-collapsible` to create a collapsible element with some custom styling and behavior.
* @param {React.ReactNode} props.children The child or children to display when the collapsible is opened.
* @returns {JSX.Element | null}
*/
function CollapsibleImplementation(props: CollapsibleImplementationProps): JSX.Element | null {

  const [isOpen, setOpen] = React.useState<boolean>(false);

  function renderTrigger(): JSX.Element {
    return (
      <div className={'collapsible-trigger ' + (isOpen ? 'collapsible-trigger-open' : '')}>
        <h3 className='collapsible-trigger-title'>Automatic Slicer</h3>
        <span>{ isOpen ? <ChevronUpIcon className='icon' /> : <ChevronDownIcon className='icon' /> }</span>
      </div>
    );
  }

  return (
    <Collapsible
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      transitionTime={100}
      trigger={renderTrigger()}>
        {props.children}
      </Collapsible>
  );
}

export default CollapsibleImplementation;