export default function (plop) {
  plop.setGenerator('component', {
    description: 'Create a component with a story and a test',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component name (PascalCase, e.g. UserCard):',
      },
      {
        type: 'input',
        name: 'dir',
        message:
          'Directory relative to src/ (e.g. components/ui or features/discussions/components):',
        default: 'components/ui',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/{{dir}}/{{kebabCase name}}.tsx',
        templateFile: 'plop-templates/component.tsx.hbs',
      },
      {
        type: 'add',
        path: 'src/{{dir}}/{{kebabCase name}}.stories.tsx',
        templateFile: 'plop-templates/component.stories.tsx.hbs',
      },
      {
        type: 'add',
        path: 'src/{{dir}}/{{kebabCase name}}.test.tsx',
        templateFile: 'plop-templates/component.test.tsx.hbs',
      },
    ],
  })
}
