import * as F from 'fp-ts/function';
import {pipe} from 'fp-ts/function';
import * as H from 'globals/helpers';
import * as A from 'fp-ts/Array';

import 'ui-kit/form-elements';

pipe(['./globals/', './components/'], A.map((folder: string) => pipe(
  require.context('./', true, /^\.\/.*\.css$/),
  (context) => pipe(context, H.method('keys'), A.map((key) => pipe(true, H.switchCases([
    [key.includes(folder), () => context(key)]
  ], F.constVoid))))
)));

