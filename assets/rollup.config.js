import buble from 'rollup-plugin-buble';
import butternut from 'rollup-plugin-butternut';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  plugins: [
    buble({
      objectAssign: 'Object.assign'
    }),
    butternut(),
    nodeResolve()
  ]
};
