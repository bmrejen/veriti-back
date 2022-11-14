import { getToken } from "./getToken.js";
import fetch from "node-fetch";

let token = null;
const url =
  "https://api-eu.securitycenter.microsoft.com/api/vulnerabilities/machinesVulnerabilities";
export async function getVulnerabilities() {
  token = token || (await getToken());
  try {
    return fetch(url, {
      headers: {
        Authorization: `Bearer ${token.access_token}`
      },
      method: "GET"
    })
      .then((res) => res.json())
      .then((res) => getRelatedIps(res));
  } catch (err) {
    console.error(err);
  }
}

function mergeMachines(arr) {
  const merged = arr.reduce((acc, { machineId, cveId }) => {
    if (!acc[machineId]) {
      acc[machineId] = { cves: [] };
    }
    acc[machineId].cves.push(cveId);
    return acc;
  }, {});
  return merged;
}

async function getRelatedIps(res) {
  // {machineId, cveId}
  const affectedMachines = getAffectedMachineIds(res);
  const mergedMachines = mergeMachines(affectedMachines);

  const allMachines = await getMachines();

  for (const affectedMachine of affectedMachines) {
    const machine = allMachines.find((machine) => machine.id === affectedMachine.machineId);
    mergedMachines[affectedMachine.machineId].ip = machine.lastIpAddress;
  }
  return mergedMachines;
}

async function getMachines() {
  const url = "https://api-eu.securitycenter.microsoft.com/api/machines";
  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token.access_token}`
      },
      method: "GET"
    });
    const json = await res.json();
    const value = json.value;
    return value;
  } catch (err) {
    console.error(err);
  }
}

function getAffectedMachineIds(res) {
  const { value } = res;
  const machines = [...new Set(value.map(({ machineId, cveId }) => ({ machineId, cveId })))];
  return machines;
}
