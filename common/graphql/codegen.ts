import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: process.env.NEXT_PUBLIC_API_URL + '/graphql',
  documents: ['apps/web/**/*.{ts,tsx,graphql}'],
  generates: {
    'apps/web/src/graphql/generated/': {
      preset: 'client',
      plugins: [],
    },
  },
  ignoreNoDocuments: true,
};
export default config;
