import { GenerateRemixPackageJsonExecutorSchema } from './schema';
import executor from './executor';

const options: GenerateRemixPackageJsonExecutorSchema = {
  outputPath: 'dummy',
};

describe('GenerateRemixPackageJson Executor', () => {
  it('can run', async () => {
    const output = await executor(options, null);
    expect(output.success).toBe(true);
  });
});
