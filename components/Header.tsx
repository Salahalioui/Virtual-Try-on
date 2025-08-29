/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full p-4 text-center">
      <div className="flex items-center justify-center">
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-zinc-800">
            Virtual Try-On
          </h1>
      </div>
      <p className="mt-4 text-lg text-zinc-600 max-w-3xl mx-auto">
        Upload your photo and an outfit to see how it looks.
        <br />
        Our AI will create a photorealistic try-on for you.
      </p>
    </header>
  );
};

export default Header;
