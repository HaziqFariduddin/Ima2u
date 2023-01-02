import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';

const Rabbit = () => {
  const [showRabbit, setShowRabbit] = useState(true);

  const rabbitProps = useSpring({
    from: { transform: 'translateY(100%)' },
    to: async next => {
      while (true) {
        await next({ transform: 'translateY(0)' });
        await next({ transform: 'translateY(-100%)' });
      }
    },
    config: { duration: 5000 }, // Adjust the duration of the animation here
    onRest: () => setShowRabbit(false),
  });

  return showRabbit ? (
    <animated.div style={rabbitProps}>
      {`{\\__/}
( • . •)
/ >♥️ u want this?`}
    </animated.div>
  ) : null;
};

export default Rabbit;