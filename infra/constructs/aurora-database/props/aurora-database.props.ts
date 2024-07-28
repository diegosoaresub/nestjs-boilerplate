import { ISecurityGroup, IVpc } from 'aws-cdk-lib/aws-ec2';
import { ApplicationProps } from '../../../props/application.props';
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";

export interface AuroraDatabaseProps extends ApplicationProps {
  vpc: IVpc;
  securityGroup: ISecurityGroup;
  dbSecret: secretsmanager.Secret;
}
