import Menu from './Menu.jsx'
/**
 * MenuWaiter Component
 * This component renders the Menu component with the `isWaiterView` prop set to `true`.
 * It is specifically used for the waiter's view of the menu.
 */
function MenuWaiter() {

  return (
    <Menu isWaiterView={true}></Menu>

  );
}

export default MenuWaiter; 