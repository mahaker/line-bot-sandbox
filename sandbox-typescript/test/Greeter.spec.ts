// TODO: module path alias
// import Greeter from '@/Greeter'
import Greeter from '../src/Greeter'

test('Greeter', () => {
    const greeter = new Greeter('hello!');
    expect(greeter.greet()).toBe('hello!');
});