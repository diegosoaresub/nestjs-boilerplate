/* eslint-disable prettier/prettier */
import { AuroraDatabase } from '../constructs/aurora-database/aurora-database.construct';
import { GenericSecurityGroup } from '../constructs/generic-security-group/generic-security-group.construct';
import { AuroraDatabaseProxy } from '../constructs/aurora-database-proxy/aurora-database-proxy.construct';
import { ApplicationProps } from '../props/application.props';
import { Construct } from 'constructs';
import { IpAddresses, Port, SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";
import { createName as defaultCreateName } from '../utils/create-name';
import { vpcCDIR } from "../constants";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";

export class AuroraDatabaseResource extends Construct {
  auroraDatabaseProxy: AuroraDatabaseProxy;
  constructor(
    scope: Construct,
    id: string,
    applicationProps: ApplicationProps,
  ) {
    super(scope, id);
    // setup prefix
    const createName = (name, config) =>
      defaultCreateName(`aurora-stack-${name}`, config);

    // get default account vpc

    const VPC_NAME = createName('vpc', applicationProps);
    const vpc = new Vpc(this, VPC_NAME, {
      vpcName: VPC_NAME,
      ipAddresses: IpAddresses.cidr(vpcCDIR),
      maxAzs: 2,
      natGateways: 1,
      subnetConfiguration: [
        {
          subnetType: SubnetType.PUBLIC,
          cidrMask: 24,
          name: 'subnet-public',
        },
        {
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 24,
          name: 'subnet-private',
        },
      ],
    });

    // create aurora database security group
    const databaseSecurityGroup = new GenericSecurityGroup(
      this,
      createName('database-sg', applicationProps),
      {
        name: 'database-sg',
        vpc,
        ...applicationProps,
      },
    );

    // ProxySG
    const databaseProxySecurityGroup = new GenericSecurityGroup(
      this,
      createName('database-proxy-sg', applicationProps),
      {
        name: 'database-proxy-sg',
        vpc,
        ...applicationProps,
      },
    );

    // Create a secret in Secrets Manager for the database credentials
    const dbSecret = new secretsmanager.Secret(this, 'DBSecret', {
      secretName:'DBSecret',
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'postgres' }),
        generateStringKey: 'password',
        excludeCharacters: '"@/\\',
      },
    });

    // create aurora database cluster
    const DATABASE_CLUSTER_NAME = createName('cluster', applicationProps);
    const { databaseCluster } = new AuroraDatabase(
      this,
      DATABASE_CLUSTER_NAME,
      {
        ...applicationProps,
        vpc,
        securityGroup: databaseSecurityGroup.securityGroup,
        dbSecret,
      },
    );
    
    // create aurora database proxy
    const DATABASE_PROXY_NAME = createName('proxy', applicationProps);
    this.auroraDatabaseProxy = new AuroraDatabaseProxy(this, DATABASE_PROXY_NAME, {
      ...applicationProps,
      auroraDatabaseCluster: databaseCluster,
      vpc,
      securityGroup: databaseProxySecurityGroup.securityGroup,
    });
    
    //Add Security Group Rules
    databaseProxySecurityGroup.addIngressSecurityGroup(
      databaseSecurityGroup.securityGroup,
      Port.tcp(databaseCluster.clusterEndpoint.port),
      `Access for the ${this.auroraDatabaseProxy.node.id} proxy`
      );
  }
}
