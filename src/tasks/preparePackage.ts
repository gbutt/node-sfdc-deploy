import {Config} from '../config';
import {packageBuilder} from './packageBuilder';

export function preparePackage(addonConfig: Config): Promise<any> {
  console.log('Preparing deployment package');
  // create deploy folder
  let pb = new packageBuilder(addonConfig);
  return pb.prepareDeployFolder()
    .then(() => Promise.all([
      pb.createMetaXml(),
      pb.createPackageXml(),
      pb.compressResource()
    ]));

}