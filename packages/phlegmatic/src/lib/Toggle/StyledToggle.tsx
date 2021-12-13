import styled from 'styled-components';

export default styled.div`
    position: relative;
    & *, & *::after, & *:after {
    box-sizing: border-box;
    }
    & input[type="checkbox"] {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    }
    & input[type="checkbox"][disabled] ~ label {
    pointer-events: none;
    }
    & input[type="checkbox"][disabled] ~ label .switch {
    opacity: 0.4;
    }
    & input[type="checkbox"]:checked ~ label .switch::after {
    content: attr(data-checked);
    left: 0;
    }
    & input[type="checkbox"]:checked ~ label .switch::before {
    content: attr(data-unchecked);
    }
    & label {
    user-select: none;
    position: relative;
    display: flex;
    align-items: center;
    }
    & label .switch {
    position: relative;
    }
    & label .switch::after {
    content: attr(data-unchecked);
    position: absolute;
    top: 0;
    text-transform: uppercase;
    text-align: center;
    }
    & label .switch::before {
    content: attr(data-checked);
    position: absolute;
    z-index: 5;
    text-transform: uppercase;
    text-align: center;
    background: rgba(255, 255, 255, 0.3);
    transform: translate3d(0, 0, 0);
    }
    & input[type="checkbox"][disabled] ~ label {
    color: rgba(119, 119, 119, 0.5);
    }
    & input[type="checkbox"]:focus ~ label .switch,
    & input[type="checkbox"]:hover ~ label .switch {
    background-color: var(--altamoon-sell-color);
    }
    & input[type="checkbox"]:focus ~ label .switch::before,
    & input[type="checkbox"]:hover ~ label .switch::before {
    color: #5e5e5e;
    }
    & input[type="checkbox"]:hover ~ label {
    color: #6a6a6a;
    }
    & input[type="checkbox"]:checked ~ label:hover {
    color: var(--altamoon-buy-color);
    }
    & input[type="checkbox"]:checked ~ label .switch {
    background-color: var(--altamoon-buy-color);
    }
    & input[type="checkbox"]:checked ~ label .switch::before {
    color: var(--altamoon-buy-color);
    }
    & input[type="checkbox"]:checked:focus ~ label .switch,
    & input[type="checkbox"]:checked:hover ~ label .switch {
    background-color: var(--altamoon-buy-color);
    }
    & input[type="checkbox"]:checked:focus ~ label .switch::before,
    & input[type="checkbox"]:checked:hover ~ label .switch::before {
    color: var(--altamoon-buy-color);
    }
    & label .switch {
    transition: background-color 0.3s cubic-bezier(0, 1, 0.5, 1);
    background: var(--altamoon-sell-color);
    }
    & label .switch::after {
    color: rgba(255, 255, 255, 1);
    }
    & label .switch::before {
    transition: transform 0.3s cubic-bezier(0, 1, 0.5, 1);
    color: #777;
    }
    & input[type="checkbox"]:focus ~ label .switch::before, & input[type="checkbox"]:hover ~ label .switch::before {
    box-shadow: 0 3px 3px rgba(0, 0, 0, 0.4);
    }
    & input[type="checkbox"]:checked ~ label .switch::before {
    transform: translate3d(100%, 0, 0);
    }
    & input[type="checkbox"]:checked:focus ~ label .switch::before, & input[type="checkbox"]:checked:hover ~ label .switch::before {
    box-shadow: 0 3px 3px rgba(0, 0, 0, 0.4);
    }
    & label .switch {
    height: 44px;
    flex: 0 0 100%;
    border-radius: 4px;
    }
    & label .switch::after {
    left: 50%;
    font-size: 0.9rem;
    line-height: 44px;
    width: 50%;
    padding: 0 12px;
    }
    & label .switch::before {
    top: 2px;
    left: 2px;
    border-radius: 2px;
    width: calc(50% - 2px);
    line-height: calc(44px - 4px);
    font-size: 0.9rem;
    }
    & label .switch:hover::before {
    box-shadow: 0 3px 3px rgba(0, 0, 0, 0.4);
    }

`;
