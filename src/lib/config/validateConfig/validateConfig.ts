import * as yup from 'yup';
import { AVAILABLE_PROVIDERS } from './types';

const binarySchema = yup.object().shape({
  url: yup.string().trim().required(),
  checksum: yup
    .string()
    .matches(
      /^sha256:[A-Fa-f0-9]{64}/,
      "checksum must be a sha256 string with the prefix 'sha256:'. e.g. 'sha256:3369b76cd2b0ba678b6d618deab320e565c3d93ccb5c2a0d5db51a53857768ae'",
    )
    .required(),
});

const nodeOptionSchema = yup.object().shape({
  count: yup.number().strict().min(1).required(),
  image: yup.string().notRequired(),
  location: yup.string().trim().required(),
  machineType: yup.string().trim().required(),
  nodeName: yup.string().trim().required(),
  projectId: yup.string().trim().required(),
  provider: yup.string().oneOf(AVAILABLE_PROVIDERS).required(),
  sshUser: yup.string().trim().required(),
  zone: yup.string().notRequired(),
});

const schema = yup.object().shape({
  project: yup.string().trim().required(),
  polkadotNetworkId: yup.string().trim().required(),
  additionalFlags: yup.string().trim().default(null).nullable(),
  chain: yup.string().trim().required(),
  state: yup.object().shape({ project: yup.string().trim().required() }).required(),
  polkadotBinary: binarySchema,

  nodeExporter: yup
    .object()
    .shape({
      enabled: yup.boolean().required(),
      binary: binarySchema,
    })
    .required(),

  polkadotRestart: yup.object().notRequired().shape({
    enabled: yup.boolean().required(),
    minute: yup.string(),
    hour: yup.string(),
    day: yup.string(),
    month: yup.string(),
    weekDay: yup.string(),
  }),

  publicNodes: yup
    .object()
    .shape({
      telemetryUrl: yup.string().notRequired(),
      loggingFilter: yup.string().notRequired(),
      additionalFlags: yup.string().notRequired(),
      nodes: yup.array().of(nodeOptionSchema).required(),
    })
    .default(null)
    .nullable(),

  validators: yup
    .object()
    .shape({
      telemetryUrl: yup.string().notRequired(),
      loggingFilter: yup.string().notRequired(),
      additionalFlags: yup.string().notRequired(),
      nodes: yup.array().of(nodeOptionSchema).required(),
    })
    .default(null)
    .nullable(),
});

export interface ValidationResult {
  error: yup.ValidationError | null;
}

const validateConfig = (dto: any): ValidationResult => {
  try {
    schema.validateSync(dto, { abortEarly: false });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return { error };
    }

    throw error;
  }

  return { error: null };
};

export default validateConfig;
